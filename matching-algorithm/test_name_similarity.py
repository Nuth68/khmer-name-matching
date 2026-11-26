import unittest

from name_similarity import compare_names, normalize_name


class NameSimilarityTests(unittest.TestCase):
    def test_normalizes_unicode_case_and_whitespace(self):
        self.assertEqual(normalize_name("  Sok   Dara "), "sok dara")
        self.assertEqual(normalize_name("e\u0301"), normalize_name("\u00e9"))

    def test_same_script_edit_distance(self):
        result = compare_names("kitten", "sitting")
        self.assertEqual(result.edit_distance, 3)
        self.assertEqual(result.score, 57)
        self.assertEqual(result.method, "Levenshtein")

    def test_known_khmer_latin_pair_uses_best_dictionary_variant(self):
        result = compare_names("សុខ ដារ៉ា", "Sokh Dara")
        self.assertEqual(result.score, 100)
        self.assertEqual(result.matched_variant, "Sokh Dara")
        self.assertEqual(result.method, "dictionary-assisted Levenshtein")
        self.assertIn("Verify this candidate", result.explanation)
        self.assertIn("does not establish identity", result.explanation)

    def test_unknown_cross_script_pair_has_no_score(self):
        result = compare_names("ឈ្មោះដែលមិនមាន", "Unknown Latin")
        self.assertIsNone(result.score)
        self.assertIn("No score available", result.explanation)

    def test_empty_input_has_no_score(self):
        result = compare_names("", "Sok Dara")
        self.assertIsNone(result.score)
        self.assertIn("Enter both names", result.explanation)


if __name__ == "__main__":
    unittest.main()
